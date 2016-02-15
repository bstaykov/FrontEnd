var windowLoadApp = window.onload;
window.onload = function () {
    if (windowLoadApp) {
        windowLoadApp();
    }

    var app = Sammy('#content', function () {
        var self;
        this.get('#/', function () {
            self = this
            self.redirect('#/home');
        });

        this.get('#/home', function () {
            var people;
            db.get()
                .then(function (response) {
                    people = response;
                    return templates.get('people');
                }, function (error) {
                    console.log(error);
                    $('#content').html(error);
                })
                .then(function (html) {
                    var template = Handlebars.compile(html);
                    var peopleHtml = template({ people: people });
                    $('#content').html(peopleHtml);
                });
        });

        this.get('#/info', function () {
            $('#content')
                .html('#/info');
        });

        this.get('#/get/:id', function () {
            db.getById(this.params.id)
                .then(function (response) {
                    console.log(response);
                }, function (error) {

                });
        });

        this.get('#/remove/:id', function () {
            db.remove(this.params.id)
                .then(function (response) {
                    self.redirect('#/home');
                }, function (error) {
                    console.log(error);
                });
        });

        this.get('#/add/:name/:age', function () {
            db.add(this.params.name, this.params.age)
                .then(function (response) {
                    $('#content').html('#/add/Ivan/23');
                }, function (error) {

                });
        });
    });

    $(function () {
        app.run('#/');
    });
}