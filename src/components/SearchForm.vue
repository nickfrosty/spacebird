<template>
    <form @submit="onSubmit">
        <div class="flex justify-between space-x-3">
            <input type="text" v-model="$store.state.searchText" placeholder="Search for a space..." class="w-full px-4 py-3 text-gray-900 rounded-lg shadow md:min-w-88">
            <button class="inline-block px-5 py-3 font-semibold text-white bg-red-600 rounded-lg shadow min-w-36 hover:bg-red-700"><i class="fas fa-search"></i> Search</button>
        </div>
        <p v-if="statusMsg" class="block px-3 py-2 mb-2 font-semibold text-center" :class="statusType == 'error' ? 'text-red-500' : ''">{{ statusMsg }}</p>
    </form>
</template>

<script>
    export default {
        name: 'SearchForm',
        data(){
            return {
                text: '',
                statusMsg: this.$store.state.responseText,
                statusType: 'error',
            }
        },
        methods:{
            onSubmit(e){
                // console.log('search submit');
                e.preventDefault()

                if ( !this.$store.state.searchText ){
                    this.statusMsg = 'Enter some tags to search for Spaces';
                    return;
                }
                else if ( this.$store.state.searchText.length < 3 ){
                    this.statusMsg = 'Search text must be at least 3 characters';
                    return;
                }
                this.statusMsg = '';
                
                // construct the searchQuery object to submit
                const searchQuery = {
                    text: this.$store.state.searchText,
                };

                // async call for the 'searchSpaces' action using the searchQuery
                this.$store.dispatch('searchSpaces', searchQuery);
                
            }
        },
    }
</script>