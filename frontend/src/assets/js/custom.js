$(document).ready(function() {
    $(".status_change .dropdown-item").click(function() {
        var getStatusText = $(this).text();
        $(this).closest(".status_dropdown").find(".status__btn").text(getStatusText);
        var generateStatusClass = `${$(this).attr('data-class')}-status`;
        $(this).closest(".status_dropdown").attr("data-color", generateStatusClass);
    });
});