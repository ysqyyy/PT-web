import request from '../utils/request';

// 响应类型定义
export interface ArbitrationResponse {
  code: number;
  message: string;
  data: Array<{
    submission: {
      submissionId: number;
      torrentId?: number;
      refuseReason?: string;
    };
    bounty: {
      bountyTitle: string;
      bountyDescription: string;
      bountyStatus: string;
    };
    creatorName: string;
  }>;
}

export interface ActionResponse {
  code: number;
  message: string;
  data: {
    success: boolean;
  };
}

// API 层只负责与服务器通信，不处理业务逻辑
export const arbitrationApi = {
  /**
   * 获取仲裁列表
   */
  getArbitrationBounties: () => 
    request.get<ArbitrationResponse>('/bounty/arbitration/all'),
  
  /**
   * 驳回仲裁
   * @param submissionId 提交ID
   */
  rejectArbitration: (submissionId: number) => 
    request.post<ActionResponse>('/bounty/arbitration/reject', { submissionId }),
  
  /**
   * 同意仲裁
   * @param submissionId 提交ID
   */
  approveArbitration: (submissionId: number) => 
    request.post<ActionResponse>('/bounty/arbitration/approve', { submissionId }),
};
