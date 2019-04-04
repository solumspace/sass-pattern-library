(function () {
    var app = angular.module('patterns');
    app.controller('FormControlsController', FormControlsController);
    FormControlsController.$inject = ['swModal'];
    function FormControlsController(swModal) {
        var vm = this;
        window.vm = vm;
		vm.swModal = swModal;
        init();
        function init() {
			vm.value = 20;
			swModal.LoadingPanel.show();
			console.log(vm.value);
        }
    }
})();
