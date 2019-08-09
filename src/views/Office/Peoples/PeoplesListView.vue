<template>
  <peoples-list v-bind:peoples="peoples" v-on:peopleClick="viewPeople"></peoples-list>
</template>

<script>
    import PeoplesList from "../../../components/PeoplesListCard";
    import axios from "axios";
    import {BACKEND_URL} from "../../../backend";

    export default {
        name: "PeoplesListView",
        components: {PeoplesList},
        data: () => ({
            peoples: []
        }),
        methods: {
            viewPeople(people) {
                console.log(people);
            },
            fetchData () {
                axios
                    .get(`${BACKEND_URL}people`)
                    .then(response => (this.peoples = response.data));
            }
        },
        created () {
            // загружаем данные, когда представление создано
            // и данные реактивно отслеживаются
            this.fetchData()
        },
        watch: {
            // при изменениях маршрута запрашиваем данные снова
            '$route': 'fetchData'
        },
    }
</script>

<style scoped>

</style>
