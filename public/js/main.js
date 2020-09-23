$(document).ready(function(){

    load_json_data('market');
   
    function load_json_data(id, parent_id)
    {
     var html_code = '';
     $.getJSON('/db/tickers.json', function(data){
   
      html_code += '<option value="">Select '+ id +'</option>';
      $.each(data, function(key, value){
       if(id == 'market')
       {
        if(value.parent_id == '0')
        {
         html_code += '<option value="'+ value.id +'">'+ value.name +'</option>';
        }
       }
       else
       {
        if(value.parent_id == parent_id)
        {
         html_code += '<option value="'+ value.symbol +'">'+ value.name +'</option>';
        }
       }
      });
      $('#'+ id).html(html_code);
     });
   
    }
   
    $(document).on('change', '#market', function(){
     var market_id = $(this).val();
     if(market_id != '')
     {
      load_json_data('stock', market_id);
     }
     else
     {
      $('#stock').html('<option value="">Select stock</option>');
     }
    });
    
});