userApp.directive('dateTime', function(){
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function(scope, element, attrs, ngModel){
      if (!ngModel) {
        console.log('no model, returning');
        return;
      }
      
      element.bind('blur keyup change', function() {
        scope.$apply(read);
      });
      
      read();
      
      function read() {
        ngModel.$setViewValue(element.val());
      }
    }
  }
});