<template>

  <Nav />
  
  <!-- <div class="container my-10">
    <router-view></router-view>
  </div> -->


  
  <div class="container mx-auto my-10">
    <main class="max-w-3xl p-5 mx-auto space-y-10">

      <router-view></router-view>

    </main>
  </div>
  
  <Footer />

</template>

<script>

// @ is an alias to /src
import { mapGetters, mapMutations, mapState } from 'vuex';
import Home from '@/views/Home.vue';
import Nav from '@/components/layout/nav.vue';
import Footer from '@/components/layout/footer.vue';

export default {
  name: 'App',
  components: {
    Nav,
    Footer,
    Home,
  },
  data(){
    return {
      // spaces: [],
      // users: []
    }
  },
  // methods: {
  //   search( searchTerms ){

  //     console.log(searchTerms);

  //     // prepare the fetch request
  //     let headersList = {
  //       "Accept": "*/*",
  //       "User-Agent": "Thunder Client (https://www.thunderclient.io)",
  //       "Authorization": "Bearer AAAAAAAAAAAAAAAAAAAAAJl%2FVAEAAAAAcR4PiFvB9Z%2ByOkWgZ0tfvSDj4kk%3DRvXvEbaoIBMP1nf8dzqNuIo0dzxaxtWYPBeM1Y80N8tRCmep5l"
  //     }

  //     // make the fetch request

  //     const API_ADDR = '';

  //     fetch(`https://api.twitter.com/2/spaces/search?query={{ searchTerms.text }}&space.fields=created_at,title,creator_id,speaker_ids,participant_count,host_ids,scheduled_start,lang&expansions=host_ids,invited_user_ids,speaker_ids&user.fields=username,profile_image_url,verified&max_results=100`, { 
  //       method: "GET",
  //       headers: headersList
  //     }).then(function(response) {
  //       return response.text();
  //     }).then(function(data) {
  //       console.log(data);
  //     })

  //   }
  // },
  // mounted(){

  //   const API_ADDR = 'http://localhost:3000/spaces';

  //   fetch(API_ADDR)
  //     .then(response => response.json())
  //     .then(data => {
  //       // console.log(data);

  //       this.spaces = data.data;
  //       this.users = data.includes.users;

  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });

  // },
  /*
  created(){
    try{
      
      // dataString = dataString.replace(/\\/g, "/");
      
      // const regex = /\\\"/gm;
      // const subst = ``;

      // // The substituted value will be contained in the result variable
      // dataString = dataString.replace(regex, subst);
      // console.log(dataString);

      let json = JSON.parse(dataString);
      
      console.log(json);
      this.listing = json.data;

      this.users = json.includes.users;

    }
    catch (e){
      var printError = function(error, explicit) {
        console.log(`[${explicit ? 'EXPLICIT' : 'INEXPLICIT'}] ${error.name}: ${error.message}`);
      }
      console.error('Unable to parse json');
      if (e instanceof SyntaxError) {
          printError(e, true);
      } 
      else {
        printError(e, false);
      }
    }

    // parse the users into a usable array
    // if ( json !== undefined && json )

  }
  */
};



// let json = JSON.parse(dataString);

// console.log(json);

</script>


<style lang="postcss">
  body{
    @apply bg-gray-200 dark:bg-gray-900 dark:text-white;
  }
</style>