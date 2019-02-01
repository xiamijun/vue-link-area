<!-- @format -->

<template>
  <div class="container">
    <Form ref="loginForm" :model="form" :rules="rules">
      <FormItem label="账号" prop="userName">
        <Input v-model.trim="form.userName" autocomplete ="off" placeholder="请输入账号"></Input>
      </FormItem>
      <FormItem label="密码"  prop="password">
        <Input type="password" v-model.trim="form.password" placeholder="请输入密码" autocomplete ="off"></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" size="large">登 录</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        userName: '',
        password: ''
      },
      rules: {
        userName: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      }
    };
  },
  methods: {
    handleSubmit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          //
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
