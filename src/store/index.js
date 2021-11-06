import { createStore } from 'vuex';


// const spaces = {
//   namespaced: true,
//   state: {
//     list: [],
//   },
//   mutations:{
//     set( listing ){
//       state.list = listing;
//     },
//   },
//   getters:{
//     get( ){
//       return listing;
//     },
//   },
//   actions:{
//     async search ( {commit} ){
//       console.log(commit);

//       const API_ADDR = 'http://localhost:3000/spaces';

//       fetch(API_ADDR)
//         .then(response => response.json())
//         .then(data => {
//           console.log(data);

//           this.spaces = data.data;
//           this.users = data.includes.users;

//         })
//         .catch(err => {
//           console.log(err);
//         }
//       );

//     }
//   },
// }

// const users = {
//   namespaced: true,
//   state: {

//   }
// }


export default createStore({
  state: {
    searched: false,
    searchText: '',
    responseText: '',
    loading: false,
    spaces: [],
    users: [],
  },
  mutations: {
    setLoading (state, loading){
      state.loading = loading;
      state.searched = true;
    },
    setResponseText (state, text){
      state.responseText = text;
    },
    setSpaces( state, spaces ){
      state.spaces = spaces;
    },
    setUsers( state, users ){
      state.users = users;
    },
  },
  getters:{
    sortSpaces: (state) => (query) => {
      // console.log('sort the spaces');
      return state.spaces.sort(() => Math.random() - 0.5);
    },
    getUsersForSpace: (state) => (space) => {
      // console.log('getUsersForSpace - start');
      // console.log(space);

      // if no users exist in the state store, then return a blank array
      if ( state.users !== undefined && state.users !== null && state.users.length == 0 )
        return []; 
      
      // extract the speakers and hosts
      let hosts = space.host_ids;
      let speakers = space.speaker_ids;
      let invited = space.invited_user_ids;

      // merge the speakers and hosts together
      if ( speakers )
        hosts = hosts.concat(speakers);

      // merge the invted speaks and hosts together
      if ( invited )
        hosts = hosts.concat(invited);

      // console.log('space name:  ' + space.title);
      // console.log(hosts);

      // filter the users array to remove all users not part of this space
      let listing = state.users.filter(function(user){

        // only return the individual 'user' if they are in the 'hosts/speakers' list 
        for (let i = 0; i < hosts.length; i++){
            if ( parseInt(hosts[i]) == parseInt(user.id) )
                return true;
        }

      });
      
      return listing;
    },
  },
  actions: {
    async searchSpaces( state, searchQuery = null ){
        this.commit('setLoading', true);
        this.commit('setResponseText', ''); // empty the response text

        let API_ADDR;

        if (searchQuery !== null && searchQuery !== undefined && searchQuery.text !== undefined)
          API_ADDR = `${process.env.VUE_APP_API_ADDR}/spaces/search/?text=${searchQuery.text}`;
        else
          API_ADDR = `${process.env.VUE_APP_API_ADDR}/spaces`;
        // console.log('API_ADDR: ' + API_ADDR);
        // console.log('searching for: ' + searchQuery.text);
        
        try {
          // empty the current spaces
          this.commit('setSpaces', []);

          // make the api call to retrieve the spaces
          await fetch(API_ADDR)
            .then(response => {
              if ( response.ok && response.status >= 200 && response.status < 300)
                return response.json();
              else if ( response.status >= 300 && response.status < 400 )
                throw new Error('Invalid response from the server');
              else if ( response.status >= 400 && response.status < 500 )
                  throw new Error('Bad request. Likely no results found');
              else{
                throw new Error('Bad response from the server');
              }
            })
            .then(data => {
              
              // log any message responses from the server
              if ( data.message !== null ){
                console.log(`Response message: ${data.message}`);
              }

              // fact check the 'spaces' and 'users' data, then commit to the state manager
              if ( data.data !== undefined ){

                // console.log('search complete');

                if ( data.data.spaces !== undefined ){
                  this.commit('setSpaces', data.data.spaces);
                  // console.log('total results: ' + data.data.spaces.length);
                }

                if ( data.data.users !== undefined )
                  this.commit('setUsers', data.data.users);
              
      
              }
            })
            .catch(error => {
              console.log(error);
            }
            
          );

          // complete the loading
          this.commit('setLoading', false);

        }
        catch(err) {
          console.log('Fetch failed');
          console.log(err);
        }
  
      },
  },
  modules: {
    // spaces,
    // users
  },
});
