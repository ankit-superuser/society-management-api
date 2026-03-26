import { Injectable } from '@nestjs/common';

@Injectable()
export class AuditLogsService {
  private auditLogs = [
    {
      id: '1',
      timestamp: new Date('2024-05-15T14:32:15'),
      userId: 'u1',
      userName: 'Super Admin',
      action: 'Created new society',
      details: 'Added Greenview Apartments',
      ipAddress: '192.168.1.1',
    },
    {
      id: '2',
      timestamp: new Date('2024-05-15T14:28:00'),
      userId: 'u2',
      userName: 'Rajesh Kumar',
      action: 'Updated subscription',
      details: 'Upgraded to Premium plan',
      ipAddress: '192.168.1.25',
    },
    {
      id: '3',
      timestamp: new Date('2024-05-15T14:15:30'),
      userId: 'u3',
      userName: 'Support Agent',
      action: 'Resolved ticket',
      details: 'TKT-003 marked as resolved',
      ipAddress: '192.168.1.10',
    },
    {
      id: '4',
      timestamp: new Date('2024-05-15T13:45:12'),
      userId: 'u1',
      userName: 'Super Admin',
      action: 'Modified user role',
      details: 'Changed Priya Sharma to Society Admin',
      ipAddress: '192.168.1.1',
    },
    {
      id: '5',
      timestamp: new Date('2024-05-15T13:30:00'),
      userId: 'u1',
      userName: 'Super Admin',
      action: 'Published announcement',
      details: 'Scheduled Maintenance notice',
      ipAddress: '192.168.1.1',
    },
    {
      id: '6',
      timestamp: new Date('2024-05-15T12:15:45'),
      userId: 'u4',
      userName: 'Lakshmi Iyer',
      action: 'User login',
      details: 'Successful authentication',
      ipAddress: '192.168.1.50',
    },
    {
      id: '7',
      timestamp: new Date('2024-05-15T11:45:00'),
      userId: 'u1',
      userName: 'Super Admin',
      action: 'Updated plan pricing',
      details: 'Premium plan updated to $299',
      ipAddress: '192.168.1.1',
    },
    {
      id: '8',
      timestamp: new Date('2024-05-15T10:30:22'),
      userId: 'u3',
      userName: 'Support Agent',
      action: 'Assigned ticket',
      details: 'TKT-005 assigned to Support Agent',
      ipAddress: '192.168.1.10',
    },
  ];

  findAll(query: any) {
    let logs = [...this.auditLogs];

    // Search filter
    if (query.search) {
      const search = query.search.toLowerCase();
      logs = logs.filter(
        (log) =>
          log.userName.toLowerCase().includes(search) ||
          log.action.toLowerCase().includes(search) ||
          log.details.toLowerCase().includes(search) ||
          log.ipAddress.toLowerCase().includes(search),
      );
    }

    // Action filter
    if (query.action) {
      logs = logs.filter(
        (log) => log.action.toLowerCase() === query.action.toLowerCase(),
      );
    }

    // User filter
    if (query.user) {
      logs = logs.filter(
        (log) => log.userName.toLowerCase() === query.user.toLowerCase(),
      );
    }

    // Start date filter
    if (query.startDate) {
      const startDate = new Date(query.startDate);
      logs = logs.filter((log) => new Date(log.timestamp) >= startDate);
    }

    // End date filter
    if (query.endDate) {
      const endDate = new Date(query.endDate);
      logs = logs.filter((log) => new Date(log.timestamp) <= endDate);
    }

    // Sort latest first
    logs.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    return {
      success: true,
      data: logs,
      total: logs.length,
    };
  }

  create(body: any) {
    const newLog = {
      id: (this.auditLogs.length + 1).toString(),
      timestamp: new Date(),
      userId: body.userId || 'unknown',
      userName: body.userName || 'Unknown User',
      action: body.action,
      details: body.details,
      ipAddress: body.ipAddress || '0.0.0.0',
    };

    this.auditLogs.unshift(newLog);

    return {
      success: true,
      message: 'Audit log created successfully',
      data: newLog,
    };
  }
}