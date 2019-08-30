<template>
  <v-container>
    <v-layout
      wrap >
      <v-flex xs12>
        <v-card class="mx-auto">
          <v-card-title>Импорт</v-card-title>
          <v-card-text>
            <v-file-input
              v-model="file"
              placeholder="XLSX документ"
              label="Список людей">
            </v-file-input>
            <span>Поля: name, dob, faculty, group, phone, citizen, room, sex, eduForm</span>
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="parseFile" color="green">Разобрать</v-btn>
            <v-btn text @click="sendFile" color="green">Загрузить</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12>
        <v-list>
          <v-list-item v-for="(p,i) in uploaded">
            <v-list-item-content>
              <v-list-item-title>
                + {{p.name}}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-for="(p,i) in peoples" >
            <v-list-item-content>
              <v-list-item-title>
                {{p.name}}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
    import XLSX from 'xlsx';
    import moment from 'moment';
    import axios from 'axios';
    import {BACKEND_URL} from "../backend";

    export default {
        name: "ImportPeoplesCard",
        data: () => ({
            file: [],
            peoples: [],
            uploaded: []
        }),
        methods: {
            sendFile () {
                this.uploaded = [];
                var cPeoples = this.peoples.slice();
                console.log(cPeoples.length);
                for (var i = 0; i < cPeoples.length; i++) {
                    const t = cPeoples[i];
                    axios.post(`${BACKEND_URL}people`, t)
                        .then(d => {
                            this.peoples = this.peoples.filter(f => f.name !== t.name && f.dob !== t.dob);
                            this.uploaded.push(t);
                        });
                }
            },
            parseFile () {
                this.readXlsx(this.file)
                    .then(result => (console.log("OK")));
            },
            readXlsx (file) {
                let reader = new FileReader();
                reader.readAsBinaryString(file);
                return new Promise((resolve, reject) => {
                    reader.onload = this.processExcelFile;
                });
            },
          processExcelFile (e) {
                  //  alert(reader.result);
                  let data = e.target.result;
              var workbookkk = XLSX.read(data, {type: 'binary'});
                  const json = XLSX.utils.sheet_to_json(
                      workbookkk.Sheets[workbookkk.SheetNames[0]],
                      { header: 0 }
                  );
                  const filterData = xls => xls.name && xls.room && (xls.citizen ||  xls.phone || xls.sex || xls.eduForm);
                  const filtered = json.filter(filterData);
                  this.peoples = [];
                  var tmp = [];

                  function parseExcelDate(excelTimestamp) {
                      const secondsInDay = 24 * 60 * 60;
                      const excelEpoch = new Date(1899, 11, 31);
                      const excelEpochAsUnixTimestamp = excelEpoch.getTime();
                      const missingLeapYearDay = secondsInDay * 1000;
                      const delta = excelEpochAsUnixTimestamp - missingLeapYearDay;
                      const excelTimestampAsUnixTimestamp = excelTimestamp * secondsInDay * 1000;
                      const parsed = excelTimestampAsUnixTimestamp + delta;
                      return isNaN(parsed) ? null : parsed;
                  }
                  tmp = filtered.map(xls => {
                      const v = {
                          name: xls.name ? `${xls.name}` : "",
                          dob: xls.dob ? moment(parseExcelDate(xls.dob)).format('DD.MM.YYYY') : null,
                          faculty: xls.faculty ? `${xls.faculty}` : null,
                          group: xls.group ? `${xls.group}` : null,
                          phone: xls.phone ? `${xls.phone}` : null,
                          citizen: xls.citizen ? `${xls.citizen}` : null,
                          room: xls.room ? `${xls.room}` : "000",
                          sex: xls.sex ? `${xls.sex}` : null,
                          eduForm: xls.eduForm ? `${xls.eduForm}` : null
                      };
                      return v;
                  });
              this.peoples = tmp;
              }
        }
    }
</script>

<style scoped>

</style>
