export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const key = url.pathname.slice(1);

    switch (request.method) {
        case "GET":
          // const key2 = "secure/ca";
          // const valueFromKV = await env.sush_dev.get(key2);
          const postObject = await env.MY_BUCKET.get(key);
          if (postObject === null) {
            return new Response("Object Not Found", { status: 404 });
          }
          const headers = new Headers();
          postObject.writeHttpMetadata(headers);
          headers.set("etag", postObject.httpEtag);
          const response = new Response(postObject.body, {
            status: 200,
            headers: {
              "Content-Type": "image/png"
              // Adjust the content type if necessary
            }
          });
          return response;
        default:
          return new Response("Method Not Allowed", {
            status: 405,
            headers: {
              Allow: "GET"
            }
        });
    }
  },
};
