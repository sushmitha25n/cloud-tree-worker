export default {
    async fetch(request, env) {
      const url = new URL(request.url);
      const key = url.pathname.slice(1);
  
      switch (request.method) {
        case 'GET':
          const object = await env.MY_BUCKET.get(key);
  
          if (object === null) {
            // return new Response('Object Not Found', { status: 404 });
            return new Response(`Object Not Found for key: ${key} in bucket: ${env.MY_BUCKET} and url : ${url}`, {
                status: 404,
              });
              
          }

        // Create a temporary file to store the binary data
        try {
            const headers = new Headers();
            object.writeHttpMetadata(headers);
            headers.set('etag', object.httpEtag);
            headers.set("Content-Type", "text/html");  
            // Convert the binary data to a Uint8Array
            // const binaryData = new Uint8Array(object.body);

            // Convert the image to a data URL
            const byteArray = new Uint8Array(object.body);
            let binary = '';
            byteArray.forEach((byte) => {
            binary += String.fromCharCode(byte);
            });
            const imageData = 'data:image/png;base64,' + btoa(binary);

            // const countryFlagLink = `<a href="https://tunnel.cloudtree.online/secure/${country}"><img src="${imageData}" alt="${country}"></a>`;
            const width = "100%";
            const height = "100%";

            // Extract email, timestamp, and country from the JSON data
            const email = 'sushmitha25n@gmail.com'; // Replace with your actual default email
            const timestamp = '2023-10-24 02:11:00'; // Replace with your actual timestamp
            const country = 'ca'; // Replace with your actual default country code

            const countryFlagLink = `<a href="https://tunnel.cloudtree.online/secure/${country}">
            <img src="${imageData}" alt="${country}"></a>`;
    
            // return new Response(binaryData, { headers });


            // Create the response body
            const responseBody = `${email} authenticated at ${timestamp} from ${countryFlagLink}`;

            // Return an HTML response
            return new Response(responseBody, {
            status: 200,
            headers: {
                'Content-Type': 'text/html',
                },
            });
            
          } catch (error) {
            return new Response(`Error writing temporary file: ${error.message}`, {
              status: 500,
            });
          }

        case 'POST':
            try {
                const requestData = await request.json();
                const email = requestData.email || "sushmitha25n@gmail.com";
                const timestamp = requestData.iat || "2023-10-24 02:11:00";
                const country = requestData.country || "ca";
                const postKey = `${country}.png`;
                const postObject = await env.MY_BUCKET.get(postKey);
                
                if (postObject === null) {
                  return new Response("Object Not Found", { status: 404 });
                }


                const headers = new Headers();
                postObject.writeHttpMetadata(headers);
                headers.set('etag', postObject.httpEtag);
                await env.sush_dev.put(`secure/${country}`, postObject.body, { expirationTtl: 86400 });

                const imageUrl = `https://tunnel.cloudtree.online/secure/${country}`;

                console.log(" ======= imageUrl  ===== ", JSON.stringify(imageUrl))

    
                // const htmlResponse = `<html><head></head><body>${email} authenticated at ${timestamp} from <a href="${imageUrl}">
                // <img src="${imageUrl}" alt="${country}">
                // </a></body></html>`;
                const htmlResponse = `<html>
                <head>
                </head>
                <body>
                    <p>${email} authenticated at ${timestamp} from
                        <a href="${imageUrl}">
                            ${country}
                        </a>
                    </p>
                </body>
                </html>`
    
                // Return an HTML response
                return new Response(htmlResponse, {
                    status: 200,
                    headers: {
                        'Content-Type': 'text/html',
                    },
                });

              } catch (error) {
                return new Response(`Bad Request: ${error.message}`, { status: 400 });
            }
  
        default:
          return new Response('Method Not Allowed', {
            status: 405,
            headers: {
              Allow: 'POST, GET',
            },
          });
      }
    },
  };
