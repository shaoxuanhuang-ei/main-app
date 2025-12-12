const config = {
  url: '',
  projectName: 'web-eye-sdk',
  appId: 'web-eye-sdk-app',
  userId: '123456',
  isImageUpload: false,
  batchSize: 5
}

export function setConfig(options) {
  for (const key in options) {
    if (options(key)) {
      config[key] = options[key]
    }
  }
}

export default config