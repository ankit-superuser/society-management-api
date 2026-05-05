import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { DataSource, Repository } from 'typeorm';
import { GetUsersQueryDto } from './dto/get-users-query.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly dataSource: DataSource,
    ) { }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({
            where: { email },
            relations: ['role'],
        });
    }

    async findById(id: number): Promise<User | null> {
        return this.userRepository.findOne({
            where: { id },
            relations: ['role'],
        });
    }

    async getUsers(query: GetUsersQueryDto) {
        const page = query.page || 1;
        const limit = query.limit || 10;
        const offset = (page - 1) * limit;

        // Safe sort columns only
        const allowedSortMap: Record<string, string> = {
            created_at: 'u.created_at',
            full_name: 'u.full_name',
            email: 'u.email',
            status: 'u.status',
        };

        const sortBy =
            allowedSortMap[query.sort_by || 'created_at'] || 'u.created_at';
        const sortOrder =
            (query.sort_order || 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        const filters: string[] = [];
        const params: any[] = [];
        let index = 1;

        // Search filter (SAFE VERSION: full_name + email)
        if (query.search && query.search.trim() !== '') {
            filters.push(`
      (
        u.full_name ILIKE $${index}
        OR u.email ILIKE $${index}
      )
    `);
            params.push(`%${query.search.trim()}%`);
            index++;
        }

        // Status filter
        // Skip if frontend sends: all / All Status / empty
        if (
            query.status &&
            query.status.trim() !== '' &&
            query.status.toLowerCase() !== 'all' &&
            query.status.toLowerCase() !== 'all status'
        ) {
            filters.push(`LOWER(u.status) = LOWER($${index})`);
            params.push(query.status.trim());
            index++;
        }

        // Role filter
        // Skip if frontend sends: role_id empty/null
        if (query.role_id && Number(query.role_id) > 0) {
            filters.push(`
      EXISTS (
        SELECT 1
        FROM user_roles ur2
        WHERE ur2.user_id = u.id
          AND ur2.role_id = $${index}
      )
    `);
            params.push(query.role_id);
            index++;
        }

        // Society filter
        if (query.society_id && Number(query.society_id) > 0) {
            filters.push(`
      EXISTS (
        SELECT 1
        FROM society_members sm2
        WHERE sm2.user_id = u.id
          AND sm2.society_id = $${index}
      )
    `);
            params.push(query.society_id);
            index++;
        }

        const whereClause = filters.length
            ? `WHERE ${filters.join(' AND ')}`
            : '';

        // Main data query
        const dataQuery = `
    SELECT
      u.id,
      u.full_name,
      u.email,
      u.status,
      u.created_at,

      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'id', r.id,
            'name', r.name
          )
        ) FILTER (WHERE r.id IS NOT NULL),
        '[]'
      ) AS roles,

      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'id', s.id,
            'name', s.name
          )
        ) FILTER (WHERE s.id IS NOT NULL),
        '[]'
      ) AS societies

    FROM users u
    LEFT JOIN user_roles ur ON ur.user_id = u.id
    LEFT JOIN roles r ON r.id = ur.role_id
    LEFT JOIN society_members sm ON sm.user_id = u.id
    LEFT JOIN societies s ON s.id = sm.society_id

    ${whereClause}

    GROUP BY u.id
    ORDER BY ${sortBy} ${sortOrder}
    LIMIT $${index} OFFSET $${index + 1}
  `;

        // Count query for pagination
        const countQuery = `
    SELECT COUNT(*)::int AS total
    FROM users u
    ${whereClause}
  `;

        const dataParams = [...params, limit, offset];
        const countParams = [...params];

        const [items, countResult] = await Promise.all([
            this.dataSource.query(dataQuery, dataParams),
            this.dataSource.query(countQuery, countParams),
        ]);

        const total = countResult[0]?.total || 0;

        // Frontend-friendly response format
        const formattedItems = items.map((item: any) => {
            const roleNames =
                Array.isArray(item.roles) && item.roles.length > 0
                    ? item.roles.map((r: any) => r.name)
                    : [];

            const societyName =
                Array.isArray(item.societies) && item.societies.length > 0
                    ? item.societies.map((s: any) => s.name).join(', ')
                    : 'Platform';

            return {
                id: item.id,
                user: item.full_name,
                email: item.email,
                role: roleNames,
                society: societyName,
                status: item.status,
                action: '-', // placeholder for action column
            };
        });

        return {
            success: true,
            message: 'Users fetched successfully',
            data: {
                items: formattedItems,
                pagination: {
                    page,
                    limit,
                    total,
                    total_pages: Math.ceil(total / limit),
                },
            },
        };
    }
}