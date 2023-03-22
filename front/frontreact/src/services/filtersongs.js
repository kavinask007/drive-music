export function songs_by_artist(data) {
  console.log(data);
  let tmp = {};
  var authorMap = new DefaultDict(Array);
  for (let i = 0; i < data.length; i++) {
    let playlistdata = data[i].playlistData;
    for (let j = 0; j < playlistdata.length; j++) {
      let artists = playlistdata[j]["songArtist"].split(",");
      artists.forEach((element) => {
        authorMap[element].push(playlistdata[j]);
      });
    }
  }
  let x = JSON.parse(JSON.stringify(authorMap));
  console.log(x);
  return authorMap;
}

class DefaultDict {
  constructor(defaultInit) {
    this.original = defaultInit;
    return new Proxy(
      {},
      {
        get: function (target, name) {
          if (name in target) {
            return target[name];
          } else {
            if (typeof defaultInit === "function") {
              target[name] = new defaultInit().valueOf();
            } else if (typeof defaultInit === "object") {
              if (typeof defaultInit.original !== "undefined") {
                target[name] = new DefaultDict(defaultInit.original);
              } else {
                target[name] = JSON.parse(JSON.stringify(defaultInit));
              }
            } else {
              target[name] = defaultInit;
            }
            return target[name];
          }
        },
      }
    );
  }
}
