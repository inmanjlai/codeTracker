import Pocketbase from 'pocketbase';

export const pb = new Pocketbase('https://imanjlai.online:443');

pb.authStore.onChange((auth) => {
    console.log("authStore changed", auth);
    currentUser.set(pb.authStore.model);
});
