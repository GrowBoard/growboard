export type ImageModalState = {
  imageString: string;
};

export interface ImageModalStateActions {
  setImageString: (imageString: string) => void;
}

export type ImageModalStateSlice = ImageModalState & ImageModalStateActions;
