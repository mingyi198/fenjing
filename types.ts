export interface Panel {
  panel: number;
  scene: string;
  camera: string;
  action: string;
  dialogue: string;
  imagePrompt: string;
  videoPrompt: string;
}

export type Storyboard = Panel[];