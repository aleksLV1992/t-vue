import ListNotes from './componets/list-notes.vue'
import Note from './componets/note.vue'

Vue.component('list-notes', ListNotes);
Vue.component('note', Note);

new Vue({el: '#app'});