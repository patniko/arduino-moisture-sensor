module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    context.log('Measurement: ' + req.params.name);
    context.log('Value: ' + req.params.measurement);
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: `Received ${req.params.name} : ${req.params.measurement}`
    };
    context.done();
};