export const getCurrentConfig = () => {
    return fetch("http://10.0.0.143/current", {
        headers: {
         'Content-Type': 'application/json',
       }
    });
}



// export const getSnippetByUserName = (username) => {
//     return fetch(`/api/snippets/${username}`, {
//       headers: {
//         'Content-Type': 'application/json',
//       }
//     });
//   };