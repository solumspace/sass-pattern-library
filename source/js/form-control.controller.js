(function () {
    var app = angular.module('patterns');
    app.controller('FormControlsController', FormControlsController);
    FormControlsController.$inject = ['swModal'];
    function FormControlsController(swModal) {
        var vm = this;
        window.vm = vm;
        init();

        function init() {
			vm.value = 20;
			vm.options = [
				{
					label: 'label 1',
					value: 1
				},
				{
					label: 'label 2',
					value: 2
				},
				{
					label: 'label 3',
					value: 3
				},
				{
					label: 'label 4',
					value: 4
				},
				{
					label: 'label 5',
					value: 5
				},
				{
					label: 'label 6',
					value: 6
				}
			]
        }
    }
})();
