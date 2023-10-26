export default {
        async fetch(request, env) {
          const url = new URL(request.url);
          const key = url.pathname.slice(1);
      
          switch (request.method) {
            case 'PUT':
                return new Response('Dummy Put successfull!');
            case 'GET':
              const object = await env.MY_BUCKET.get(key);
      
              if (object === null) {
                // return new Response('Object Not Found', { status: 404 });
                return new Response(`Object Not Found for key: ${key} in bucket: ${env.MY_BUCKET} and url : ${url}`, {
                    status: 404,
                  });
                  
              }
      
              const headers = new Headers();
              object.writeHttpMetadata(headers);
              headers.set('etag', object.httpEtag);
      
              return new Response(object.body, {
                headers,
              });
            case 'DELETE':
              await env.MY_BUCKET.delete(key);
              return new Response('Deleted!');
      
            default:
              return new Response('Method Not Allowed', {
                status: 405,
                headers: {
                  Allow: 'PUT, GET, DELETE',
                },
              });
          }
        },
      };
