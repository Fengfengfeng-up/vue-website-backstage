<template>
  <el-drawer
    :show-close="false"
    :with-header="false"
    :visible.sync="drawer"
    size="25%"
    class="user"
  >
    <div class="user-wrap">
      <div class="user-info">
        <el-upload
          action=""
          :http-request="httpRequest"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
        >
          <img
            src="../../assets/avatar.jpg"
            class="user-info-avatar"
          >
        </el-upload>
        <div v-if="!showInput" class="user-info-name" @dblclick="changeName">
          {{ name }}
        </div>
        <el-input
          v-else
          ref="input"
          v-model="currentName"
          :maxlength="10"
          show-word-limit
          placeholder="取个响亮的名儿..."
          class="user-info-name"
          @blur="updateProfile"
        />
      </div>
      <div class="user-tabs">
        <el-button
          size="mini"
        ><a
          href="https://www.striveforus.com/"
          target="_blank"
        >网站</a></el-button>
        <el-button
          size="mini"
        ><a
          href="https://github.com/Fengfengfeng-up"
          target="_blank"
        >github</a></el-button>
        <el-button size="mini" @click="innerDrawer = true">修改密码</el-button>
        <el-button size="mini" @click="logout">退出账号</el-button>
      </div>
      <el-drawer
        class="user-password"
        size="25%"
        :show-close="false"
        :with-header="false"
        append-to-body
        destroy-on-close
        :visible.sync="innerDrawer"
      >
        <el-form
          ref="form"
          label-position="left"
          :rules="rules"
          class="user-password-form"
          :model="form"
          label-width="80px"
        >
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input
              ref="oldPassword"
              v-model="form.oldPassword"
              type="password"
            />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="form.newPassword" type="password" />
          </el-form-item>
          <el-form-item label="确认密码" prop="newPasswordAgain">
            <el-input v-model="form.newPasswordAgain" type="password" />
          </el-form-item>
          <el-form-item>
            <el-button
              size="medium"
              type="primary"
              @click="submit"
            >保存</el-button>
            <el-button
              size="medium"
              @click="$refs.form.resetFields()"
            >重置</el-button>
          </el-form-item>
        </el-form>
      </el-drawer>
    </div>
  </el-drawer>
</template>

<script>
import { mapGetters } from 'vuex'
import uploadToQiniu from '@/utils/qiniu'

export default {
  components: {},
  data() {
    const checkNewPasswordAgain = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.form.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      showInput: false,
      drawer: false,
      innerDrawer: false,
      currentName: '',
      form: {
        oldPassword: '',
        newPassword: '',
        newPasswordAgain: ''
      },
      rules: {
        oldPassword: { required: true, message: '请输入旧密码' },
        newPassword: { required: true, message: '请输入新密码' },
        newPasswordAgain: { required: true, validator: checkNewPasswordAgain }
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'name'])
  },
  watch: {
    innerDrawer(val) {
      // 重置修改密码表单
      !val && this.$refs.form.resetFields()
    }
  },
  created() {
    this.currentName = JSON.parse(JSON.stringify(this.name))

    this.$bus.$on('show-me', () => {
      this.drawer = true
    })
  },
  methods: {
    changeName() {
      this.showInput = true
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    async logout() {
      this.$store.dispatch('user/logout')
    },
    httpRequest({ file }) {
      uploadToQiniu(file, res => {
        this.updateProfile(res)
      })
    },
    updateProfile({ url }) {
      this.$store.dispatch('user/updateProfile', {
        avatar: url || this.avatar,
        name: this.currentName || this.name
      })

      if (this.showInput) {
        this.showInput = false
      }
    },
    beforeAvatarUpload(file) {
      const types = ['image/jpeg', 'image/png', 'image/gif']
      const isImage = types.includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isImage) {
        this.$message.error('上传头像图片格式错误!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isImage && isLt2M
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$store
            .dispatch('user/updatePassword', {
              oldPassword: this.form.oldPassword,
              newPassword: this.form.newPassword
            })
            .then(res => {
              console.log(res)
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.user {
  &-wrap {
    background-color: #304156;
    padding: 20px;
  }
  &-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    &-avatar {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      cursor: pointer;
      user-select: none;
    }
    &-name {
      cursor: pointer;
      color: #fff;
      font-size: 25px;
      text-align: center;
      padding: 50px 0;
    }
  }
  &-tabs {
    display: flex;
    justify-content: space-around;
  }
  &-password {
    height: 45%;
    position: relative;
    bottom: 0;
    &-form {
      padding: 40px 30px;
    }
  }
}
</style>
