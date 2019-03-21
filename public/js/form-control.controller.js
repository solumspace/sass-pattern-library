(function () {
    var app = angular.module('patterns');
    app.controller('FormControlsController', FormControlsController);
    function FormControlsController() {
        var vm = this;
        window.vm = vm;

        init();
        function init() {
			vm.value = 20;
			console.log(vm.value);
        }
    }
})();
