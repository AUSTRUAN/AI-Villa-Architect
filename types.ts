
export enum AppStep {
  INPUT = 1,
  SELECTION = 2,
  FINAL = 3
}

export interface VillaConfig {
  style: string;
  floors: string;
  area: string;
  referenceImage?: string; // Base64 data URL
}

export interface GeneratedImage {
  id: string;
  url: string; // Base64 data URL
  prompt: string;
  timestamp: number;
}

export enum Season {
  SPRING = '春天',
  SUMMER = '夏天',
  AUTUMN = '秋天',
  WINTER = '冬天'
}
