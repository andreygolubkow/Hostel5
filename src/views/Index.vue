<template>
  <v-app>
      <v-app-bar app v-if="user">
        <v-toolbar-title class="headline text-uppercase">
          <span>АИС Общежитие</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          text
          to="admin"
          v-if="user.admin"
        >
          <span class="mr-2">Администратор</span>
        </v-btn>
        <v-btn
          text
          to="sanitary"
          v-if="user.sanitary || user.admin"
        >
          <span class="mr-2">СанКомиссия</span>
        </v-btn>
      </v-app-bar>
    <v-content>
<!---
      <v-flex xs12 class="ma-1" v-if="alert">
        <v-alert :type="alert.type">
          {{alert.text}}
        </v-alert>
      </v-flex>

      <v-card class="ma-1" min-width="300" >
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

      <v-card class="pa-1 ma-1">
        <v-card-title>Вопрос-ответ</v-card-title>

        <v-card-text>
          <v-container v-for="(m,i) in messages">
            <div class="subtitle-1">{{m.text}}</div>
            <div class="body-2">{{m.answer}}</div>
            <v-divider></v-divider>
          </v-container>
        </v-card-text>
      </v-card>

      <v-card class="pa-1 ma-1">
        <v-card-title>Документы</v-card-title>

        <v-card-text>
          <v-container v-for="(d,i) in documents">
            <v-list-item :to="d.url">
              <v-list-item-title>{{d.name}}</v-list-item-title>
              <v-divider></v-divider>
            </v-list-item>
          </v-container>
        </v-card-text>
      </v-card>
*/--->
    </v-content>
    </v-app>
</template>

<script>
    import VueRecaptcha from 'vue-recaptcha'
    import {BACKEND_URL} from "../backend";
    import axios from "axios";
    import {MAIN_URL} from "../mainPage";


    export default {
        name: 'Index',
        components: { VueRecaptcha },
        data: () => ({
            user: null,
            message:{
                from: "",
                subject: "",
                text: ""
            },
            messages: [],
            documents: [],
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
                if (this.message.text.length === 0) {
                    return false;
                }
                if (this.message.from.length === 0) {
                    this.message.from = "Anonym";
                }


                this.$refs.recaptcha.execute()
            },

            onCaptchaExpired () {
                this.$refs.recaptcha.reset()
            },
            fetchData () {
                /*axios
                    .get(`${BACKEND_URL}message`)
                    .then(response => (this.messages = response.data));

                axios
                    .get(`${BACKEND_URL}document`)
                    .then(response => (this.documents = response.data)); */

                axios
                    .get(`${BACKEND_URL}me`)
                    .then((response) => {
                        this.user = response.data;
                        return this.user;
                    })
            }
        },
        created() {
            this.fetchData();
        }
    };
</script>
