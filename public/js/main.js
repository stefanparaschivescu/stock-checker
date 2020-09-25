$(document).ready(function(){

    var availableStocks = [];

    load_json_data('market');
   
    function load_json_data(id, parent_id)
    {
     var html_code = '';
     $.getJSON('/db/tickers.json', function(data){
   
      html_code += '<option value="">Select '+id+'</option>';
      $.each(data, function(key, value){
       if(id == 'market' && value.parent_id == '0')
       {
         html_code += '<option value="'+ value.id +'">'+ value.name +'</option>';
       }
       else
       {
        if(value.parent_id == parent_id)
        {
        var obj = {};
        obj["name"] = value.name;
        obj["symbol"] = value.symbol;
        obj["has_intraday"] = value.has_intraday;
        obj["has_eod"] = value.has_eod;
        availableStocks.push(obj);
        }
      }
      });
      $('#'+ id).html(html_code);
      if(id === 'stock') {
        console.log(availableStocks);
        $( function() {
        $("#input").autocomplete({
          source:  function (request, response) {
            response($.map(availableStocks, function (obj, key) {
              
              var name = obj.name.toUpperCase();
              
              if (name.indexOf(request.term.toUpperCase()) != -1) {				
                return {
                  label: obj.name + ' (' + obj.symbol + ')', // Label for Display
                  value: obj.symbol // Value
                }
              } else {
                return null;
              }
            }));			
          },
          minLength: 2,
        });
      } );
      }
     });
   
    }

    $(document).on('change', '#market', function(){
     var market_id = $(this).val();
     console.log(market_id);
     if(market_id != '')
     {
      load_json_data('stock', market_id);

     }
     availableStocks=[];
    });

  //   $(".clickable-row").click(function() {
  //     window.location = $(this).data("url");
  // });
  
});