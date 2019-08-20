<template>
    <v-container>
      <v-layout>
        <v-col class="col-12">
          <v-row class=" xs12 sm10" align="center">
            <v-card class="mx-auto col-md-9  col-xs-12" min-width="340">
              <v-card-title>Сообщения</v-card-title>
              <v-card-text>
                <v-list dense>
                  <v-list-item v-for="(m,i) in messages" @click.stop="setAnswer(m)" two-line>
                    <v-list-item-content>
                      <v-list-item-title>
                      <p>
                          <v-chip small label color="red" text-color="white" v-if="m.answer.length===0" class="ma-1">
                            Без ответа
                          </v-chip>
                          <v-chip small label color="indigo" text-color="white" v-if="!m.public" class="ma-1">
                            Скрыт
                          </v-chip>
                          {{m.from}}: {{m.subject}}
                      </p>
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        <span class="body-2">
                            {{m.text}}
                          </span>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>


              </v-card-text>
            </v-card>
          </v-row>
        </v-col>

      </v-layout>

      <v-dialog v-if="dialogMessage" v-model="editMessageDialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Редактировать сообщение</span>
          </v-card-title>
          <v-card-text>
            <span class="subtitle-2">От {{dialogMessage.from}}</span>
            <span class="subtitle-2">  {{dialogMessage.subject}}</span>
            <blockquote class="blockquote">
                {{dialogMessage.text}}
            </blockquote>

            <v-row>
              <v-col cols="12">
                <v-textarea
                  label="Ответ"
                  v-bind:value="dialogMessage.answer"
                ></v-textarea>
              </v-col>
            </v-row>

          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="closeDialog()">Закрыть</v-btn>
            <v-btn color="green" text @click="saveMessage()">Сохранить</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
</template>

<script>
    import {BACKEND_URL} from "../../backend";
    import axios from "axios";
    import moment from "moment";

    export default {
        name: "Index",
        data: () => ({
            messages: [],
            dialogMessage: null,
            editMessageDialog: false
        }),
        methods: {
            setAnswer (message) {
                this.dialogMessage = message;
                this.editMessageDialog = true;
            },
            fetchData: function () {
                axios
                    .get(`${BACKEND_URL}message`)
                    .then(response => (this.messages = response.data));
            },
            formatTime (datetime) {
                return moment(datetime).format("DD.MM HH:mm");
            },
            closeDialog () {
                this.editMessageDialog = false;
                this.dialogMessage = null;
            },
            saveMessage () {
                axios
                    .put(`${BACKEND_URL}message/${this.dialogMessage._id}`, this.dialogMessage)
                    .then(res => {
                        const index = this.messages.findIndex(m => m._id === this.dialogMessage._id);
                        this.messages[index] = res.data;
                        this.closeDialog();
                    });
            }
        },
        created () {
            this.fetchData()
        },
        watch: {
            // при изменениях маршрута запрашиваем данные снова
            '$route': 'fetchData',
        },
        computed: {
        }
    }

</script>

<style scoped>
  .v-sheet--offset {
    top: -24px;
    position: relative;
  }
</style>
