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

      <v-flex xs12 class="pa-1 ma-1" v-if="alert">
        <v-alert :type="alert.type">
          {{alert.text}}
        </v-alert>
      </v-flex>

      <v-card class="pa-2 ma-2">
        <v-card-title>
          Напишите нам
        </v-card-title>

        <v-card-text>
          <v-form
            v-if="!hideForm"
            method="post"
            @submit.prevent="validate">

              <v-text-field
                name="from"
                v-model="message.from"
                label="От кого"
                placeholder="Хотите ответ? Напишите эл. почту/номер комнаты/ФИО"/>

              <v-select
                name="subject"
                v-model="message.subject"
                :items="['Общежитие','Пож. безопасноть','Заселение','Плотник, электрик и др. службы', 'Что-то сломалось','Другое']"
                label="Тема"
                placeholder="Не знаешь что выбрать? Выбери 'другое'"
                dense
              ></v-select>

              <v-text-field
                v-model="message.text"
                name="text"
                placeholder="Вопросы, замечания, предложения пишите сюда"
                label="Текст сообщения"
                required/>


              <vue-recaptcha
                ref="recaptcha"
                size="invisible"
                :sitekey="sitekey"
                @verify="register"
                @expired="onCaptchaExpired"
              />

            <v-btn class="mr-4" type="submit">Отправить</v-btn>
          </v-form>
          <v-row xs5 align="center"
                 justify="center" v-if="hideForm" class="pa-2 ma-2 ">
            <v-img
              align="center"
              justify="center"
              src="../assets/cat.webp"
              max-width="300"
            ></v-img>
          </v-row>
        </v-card-text>
      </v-card>






    </v-content>
    </v-app>
</template>

<script>
    import VueRecaptcha from 'vue-recaptcha'
    import {BACKEND_URL} from "../backend";
    import axios from "axios";


    export default {
        name: 'Index',
        components: { VueRecaptcha },
        data: () => ({
            message:{
                from: "",
                subject: "",
                text: ""
            },
            hideForm: false,
            alert: null,
            sitekey: '6Lc0UrMUAAAAANiuXF3PirUM8E98Fq5vrrVt6SHg'
        }),
        methods: {
            register (recaptchaToken) {
                axios.post(`${BACKEND_URL}message`, {
                    message: this.message,
                    recaptcha: recaptchaToken
                }).then((data) => {
                    if (data.data._id) {
                        this.alert = {
                            type: "success",
                            text: "Отправлено. Спасибо за обращение!"
                        };
                        this.hideForm = true;
                    } else {
                        this.alert = {
                            type: "error",
                            text: "Что-то пошло не так :("
                        };
                        this.hideForm = true;
                    }
                });
            },
            validate () {
                this.$refs.recaptcha.execute()
            },

            onCaptchaExpired () {
                this.$refs.recaptcha.reset()
            }
        }
    };
</script>
