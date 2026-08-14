export interface User {
  id: string;
  name: string;
  tcNo?: string;
  email: string;
  phone: string;
  birthDate: string;
  role: 'teacher' | 'admin';
  school: string;
  branch: string;
  trainingCompleted: boolean;
}

export type RouteCategory = 
  | 'Ulus ve Müzeler Rotası'
  | 'Augustus ve Hacı Bayram Rotası'
  | 'Ankara Kalesi ve Samanpazarı'
  | 'Cumhuriyete Giden Yol'
  | 'Gordion ve Antik Ankara'
  | 'Beypazarı Kültür Rotası';

export interface DigitalStoryCard {
  id: string;
  title: string;
  routeCategory: RouteCategory;
  district: string;
  authorId: string;
  authorName: string;
  authorSchool: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  targetLevel: string;
  tags: string[];
  viewsCount: number;
}

export interface ProjectContractInfo {
  contractNo: string;
  activityName: string;
  activityLocation: string;
  beneficiaryOrg: string;
  dates: string;
  participantCount: string;
  trainers: string[];
  beneficiaryFeedback: string;
  participantFeedback: string;
  impactFeedback: string;
  futureRecommendations: string;
}
