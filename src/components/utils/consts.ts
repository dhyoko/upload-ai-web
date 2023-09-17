export enum VIDEO_INPUT_SUBMIT_STATUS {
  WAITING = 'Waiting',
  CONVERTING = 'Converting...',
  UPLOADING = 'Uploading...',
  GENERATING = 'Generating...',
  SUCCESS = 'Success!'
}

export type InputSubmitStatus = VIDEO_INPUT_SUBMIT_STATUS;