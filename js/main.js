function formattedDate(date) {
  var d = new Date(date || Date.now()),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [day, month, year].join('/');
}

function InvoiceController($scope) {

  $scope.logoRemoved = false;
  $scope.printMode = false;

  var sample_invoice = {
    tax: 21.00,
    invoice_number: "2014-001",
    invoice_date: "",
    customer_info: {
      name: "Bedrijfsnaam",
      web_link: "referentie/kenmerk",
      address1: "Hoofdstraat 1",
      address2: "Tilburg",
      postal: "5014 LT"
    },
    company_info: {
      name: "Solobit",
      web_link: "http://solobit.net",
      address1: "Groeseindstraat 29-09",
      address2: "5014 LT Tilburg",
      postal: "The Netherlands",
      coc: "KvK: 57191557",
      irs: "BTW: NL140168102B01"
    },
    items:[
      { qty: 1, description: "Consult", cost: 60 }
    ]
  };

  var default_logo = "https://avatars2.githubusercontent.com/u/2054667?s=140";

  if(localStorage["invoice"] == "" || localStorage["invoice"] == null){
    $scope.invoice = sample_invoice;
  }
  else{
    $scope.invoice =  JSON.parse(localStorage["invoice"]);
  }

  if (localStorage["logo"]) {
    $scope.logo = localStorage["logo"];
  } else {
    $scope.logo = default_logo;
  }

  $scope.addItem = function() {
    $scope.invoice.items.push({ qty:1, cost:70, description:"Consult" });
  };

  $scope.removeLogo = function(element) {
    var elem = angular.element("#remove_logo");
    if(elem.text() == "Toon logo"){
      elem.text("Verwijder logo");
      $scope.logoRemoved = false;
    } else {
      elem.text("Toon logo");
      $scope.logoRemoved = true;
    }
    localStorage["logo"] = "";
  };

  $scope.editLogo = function() {
    $("#imgInp").trigger("click");
  };

  $scope.showLogo = function() {
    $scope.logoRemoved = false;
  };

  $scope.removeItem = function(item) {
    $scope.invoice.items.splice($scope.invoice.items.indexOf(item), 1);
  };

  $scope.invoice_sub_total = function() {
    var total = 0.00;
    angular.forEach($scope.invoice.items, function(item, key){
      total += (item.qty * item.cost);
    });
    return total;
  };

  $scope.calculate_tax = function() {
    return (($scope.invoice.tax * $scope.invoice_sub_total())/100);
  };

  $scope.calculate_grand_total = function() {
    localStorage["invoice"] = JSON.stringify($scope.invoice);
    return $scope.calculate_tax() + $scope.invoice_sub_total();
  };

  $scope.printInfo = function() {
    window.print();
  };

  $scope.clearLocalStorage = function() {
    var confirmClear = confirm("Weet je zeker dat je de faktuur wilt wissen?");
    if(confirmClear){
      localStorage["invoice"] = "";
      localStorage["logo"] = "";
      $scope.invoice = sample_invoice;
    }
  };

};

angular.module('jqanim', []).directive('jqAnimate', function() {
  return function(scope, instanceElement){
    setTimeout(function() {instanceElement.show('slow');}, 0);
  }
});

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $('#company_logo').attr('src', e.target.result);
      localStorage["logo"] = e.target.result;
    }
    reader.readAsDataURL(input.files[0]);
  }
}

// window.onbeforeunload = function(e) {
//   confirm('Are you sure you would like to close this tab? All your data will be lost');
// };

$(document).ready(function() {
  $("#invoice_data").val(formattedDate());
  $("#invoice_number").focus();
  $("#imgInp").change(function() {
    readURL(this);
  });
});
