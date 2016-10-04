$(document).ready(function(){
  $('.category-delete').click(function(e){
     $target = $(e.target);
     $.ajax({
      type:'DELETE',
      url:'/categories/delete/'+ $target.attr('data-category-id'),
      data: { 
          _csrf: $target.attr('data-csrf')
      },
      success:function(res) {
      	$target.parent().parent().remove();
      	alert('Category Removed');
      	window.location.href='/manage/categories'
      },
      error:function(error) {
      	alert(error);
      	console.log(error);
      }
     });
  });
});