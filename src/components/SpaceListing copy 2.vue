<template>

    <!-- <VueTailwindPagination  v-if="total > 0" @click="paginate" @page-changed="current = $event; " :current="currentPage" :total="total" :per-page="perPage" /> -->

        <!-- <t-pagination
        :total-items="totalRows"
        :per-page="perPage"
        :limit="limit"
        :disabled="disabled"
        v-model="currentPage"
        /> -->
        
    <pagination :pages="5" @page-changed="paginate" />

    <!-- <section class="mt-5 space-y-4" v-for="space in " :key="space.id">

        <space-card :space="space" />
    
    </section> -->
    
</template>


<script>

import './Pagination.vue';



// import Vue from 'vue'
// import VueTailwind from 'vue-tailwind'

// import TInput from 'vue-tailwind/dist/t-input'
// import TButton from 'vue-tailwind/dist/t-button'

// const settings = {
//   't-input': {
//     component: TInput,
//     props: {
//       classes: 'block w-full px-3 py-2 text-black placeholder-gray-400 transition duration-100 ease-in-out bg-white border border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed',
//       // ...More settings
//     }
//   },
//   't-button': {
//     component: TButton,
//     props: {
//       classes: 'block px-4 py-2 text-white transition duration-100 ease-in-out bg-blue-500 border border-transparent rounded shadow-sm hover:bg-blue-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50  disabled:opacity-50 disabled:cursor-not-allowed',
//       // ...More settings
//     }
//   },
// }

// Vue.use(VueTailwind, settings)


// import 'ocrv/vue-tailwind-pagination/styles'
// import VueTailwindPagination from '@ocrv/vue-tailwind-pagination'
import SpaceCard from './SpaceCard.vue'
import Pagination from './Pagination.vue';

export default {
    name: 'SpaceListing',
    components: {
        SpaceCard,
        // VueTailwindPagination,
        Pagination,
    },
    data() {
        return {
            currentSpaces: [],
            spaces: [],
            current: 1,
            currentPage: 1,
            perPage: 10,
            total: 0,
            start: 0,
        }
    },
    mounted(){
        this.total = this.$store.state.spaces.length;
    },
    beforeUpdate() {
        console.log('beforeUpdate: space listing');
        this.total = this.$store.state.spaces.length;
        console.log('total: ' + this.total);
    },
    methods:{
        paginate( page ){
            console.log('page: ' + page);
            this.currentSpaces = this.spaces.slice( this.start, this.start+this.perPage);

            return;
            console.log('init: ' + this.current);
            // this.total = spaces.length;

            // this.currentSpaces = spaces;

            console.log('old: ' + this.current);

            // if ( newPage )
            //     this.currentPage = this.newPage;
            // else if ( this.current !== undefined && this.current !== null )
            //     this.currentPage = this.current;
            
            console.log('new: ' + this.currentPage);

            // return ;
            this.currentPage = this.current;
            this.start = this.current * this.perPage;

            // this.currentSpaces = this.spaces.slice( this.start, this.start+this.perPage);
            
            console.log('done: ');
        },
        // sort the spaces using the user defined settings
        sort(){
            
        },
    },
}
</script>