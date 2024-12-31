export const testget = (req, resp) => {
    resp.send("Hello from client side");
}

export const testpost = (req, resp) => {
    console.log(req.body);
    resp.send("Great Going");
}