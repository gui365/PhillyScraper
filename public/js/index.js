if ($(".articles").children().length === 0) {
  $("#logo-big").show()
} else {
  $("#logo-big").hide()
}

if ($(".articles").children().length === 0) {
  $(".logo").hide()
} else {
  $(".logo").show()
}

$(document).ready(function(){
  
  // OPEN MODAL AND SHOW COMMENT IF EXISTS
  $(".comments").on("click", function() {
    $("#comment-body").val("");
    var articleId = $(this).attr("data-id");
    $(".article-id").text(articleId);

    $.ajax({
      method: "GET",
      url: `/articles/${articleId}`
    })
    .then(function(articleData){
      // console.log(articleData);
      $(".modal-title").text(articleData.title);
      if (articleData.comment) {
        $("#comment-body").val(articleData.comment.body);
      }
      $("#modal-comment").click();
    })
  });

  // SAVE COMMENT
  $(".save-comment").on("click", function() {
    var articleId = $(".article-id").text();
    $(".close").click();
    
    $.ajax({
      method: "POST",
      url: `/articles/${articleId}`,
      data: {
        body: $("#comment-body").val()
      }
    })
    // .then(function () {
    // })
    .catch(function(err) {
      console.log(err);
    })
  });

  $(".delete-btn").on("click", function() {
    $.ajax("/delete", {
      type: "DELETE"
    })
    window.location.reload();
  })

});
