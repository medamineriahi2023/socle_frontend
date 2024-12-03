export interface ConfirmActionDialogData {
  title?: string;
  message: string;
  errorMessage?:string

  onConfirm?: (...args) => any;
}

export interface InfoMessageDialogData {
  type: 'success' | 'failure';
  message: string;
}
