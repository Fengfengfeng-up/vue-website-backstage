import * as qiniu from 'qiniu-js'
import { getToken } from '@/api/upload'

// 七牛云上传
export default function(file, callback) {
  const config = {
    useCdnDomain: true,
    region: qiniu.region.z2
  }

  const putExtra = {
    mimeType: [
      'image/png',
      'image/jpeg',
      'image/gif',
      'image/jpg',
      'application/zip',
      'application/x-zip-compressed',
      'mp3',
      'mp4'
    ]
  }

  const observer = {
    error: err => {
      console.log('上传出错：', err)
      this.$message.error('出现未知的错误，请您重新上传！')
    },
    complete: callback
  }

  getToken().then(res => {
    const token = res.data
    const observable = qiniu.upload(file, file.name, token, putExtra, config)
    observable.subscribe(observer) // 上传开始
    // subscription.unsubscribe(); // 上传取消
  })
}
