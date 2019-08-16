<template>
  <v-app>
      <v-app-bar app>
        <v-toolbar-title class="headline text-uppercase">
          <span>Hostel</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          text
          to="office"
        >
          <span class="mr-2">Office</span>
        </v-btn>
      </v-app-bar>
    <v-content>

      <div id="app">
        <div class="container my-4">
          <div class="row justify-content-center">
            <div class="col-md-8">
              <h2 class="text-center mb-4">
                Sign Up Form with Google reCAPTCHA
              </h2>
              <form
                method="post"
                @submit.prevent="validate">
                <div class="form-group">
                  <input
                    type="email"
                    name="email"
                    class="form-control"
                    placeholder="Enter your e-mail address"
                    required />
                </div>
                <div class="form-group">
                  <input
                    type="password"
                    name="password"
                    class="form-control"
                    placeholder="Enter your password"
                    required />
                </div>
                <div class="form-group">
                  <vue-recaptcha
                    ref="recaptcha"
                    size="invisible"
                    :sitekey="sitekey"
                    @verify="register"
                    @expired="onCaptchaExpired"
                  />
                  <button
                    type="submit"
                    class="btn btn-primary btn-block">
                    Sign Up
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>


    </v-content>
    </v-app>
</template>

<script>
    import VueRecaptcha from 'vue-recaptcha'


    export default {
        name: 'Index',
        components: { VueRecaptcha },
        data: () => ({
            email: null,
            password: null,
            sitekey: '6Lc0UrMUAAAAANiuXF3PirUM8E98Fq5vrrVt6SHg'
        }),
        methods: {
            register (recaptchaToken) {
                axios.post('https://yourserverurl.com/register', {
                    email: this.email,
                    password: this.password,
                    recaptchaToken: recaptchaToken
                })
            },

            validate () {
                // тут можно добавить проверку на валидацию
                // например, с помощью vee validate
                // если с валидацией наших полей все хорошо, запускаем каптчу
                this.$refs.recaptcha.execute()
            },

            onCaptchaExpired () {
                this.$refs.recaptcha.reset()
            }
        }
    };
</script>
