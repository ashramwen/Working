/*
 MultiSelect v1

 Checkbox in Select

 Augustine
 2013/6/20
 */
$.fn.multiselect = function (option) {
    var $listSelect = $(this).find("div.list-select");
    $(document).click(function (e) {
        $("div.custom-select").find('div.drop-select:visible').slideUp('fast');
    });

    $(this).find("div.text-select").on("click", function (e) {
        e.stopPropagation();
        $("div.text-select").not(this).next('div.drop-select:visible').slideUp('fast');
        $(this).next("div.drop-select").slideToggle('fast');
    });

    $(this).find("input.no-select").on("click", function (e) {
        e.stopPropagation();
        $(this).parents("div.drop-select").slideToggle('fast');
    });

    $(this).find("input.all-select").on("click", function (e) {
        e.stopPropagation();
        var isAllChecked = $(this).is(':checked');
        $listSelect.find('input[type="checkbox"]').each(function () {
            $(this)[0].checked = isAllChecked;
        });
    });

    $(this).find("input.option-select").on("click", function (e) {
        e.stopPropagation();
        $listSelect.find('input.option-select[type="checkbox"]').each(function () {
            if (!$(this).is(':checked')) {
                $listSelect.find("input.all-select")[0].checked = false;
                return false;
            }
            $listSelect.find("input.all-select")[0].checked = true;
        });
    });

    $(this).find("input.yes-select").on("click", function (e) {
        e.stopPropagation();
        if (option != undefined && option.YesClick != undefined)
            option.YesClick();
        $(this).parents("div.drop-select").slideToggle('fast');
    });
};
