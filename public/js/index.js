var $newArticles = $("#new_articles");
var $clearArticles = $("#clr_articles");

$(document).ready(function () {
    $(document).on("click", ".btn_save", function () {
        var $btn = $(this);
        var article = {
            url: $btn.parent().parent().parent().find(".card-headline").attr("href"),
            date: $btn.parent().parent().parent().find(".card-date").text(),
            headline: $btn.parent().parent().parent().find(".card-headline").text(),
            photo: $btn.parent().parent().parent().parent().find(".card-img-right").attr("src"),
            summary: $btn.parent().parent().parent().find("p").text()
        }

        API.saveArticle(article).then(function (data) {
            $btn.parent().parent().parent().parent().parent().parent().parent().remove();
        });
    });

    $(document).on("click", ".btn_delete", function () {
        var $btn = $(this);

        API.deleteArticle($btn.attr("data-id")).then(function () {
            $btn.parent().parent().parent().parent().parent().parent().parent().remove();
        });
    });

    $(document).on("click", ".btn_notes", function () {
        var $btn = $(this);
        //Add all the comments
        var $list = $(document).find('#comments_list');
        $list.empty();

        //ID for modal.
        $(document).find(".btn_comment").attr("data-id", $btn.attr("data-id"));

        API.getComments($btn.attr("data-id")).then(function (data) {
            var item = $("<li>");
            var li_row = $("<div class= 'row'>");
            var li_comment = $("<p>").addClass("col-10");
            li_comment.text(data.comments.comment);
            var li_removes = $("<div>").addClass("col-1");
            li_removes.append($(`<i data_id = ${data.comments._id}>`)
                .addClass("fas fa-trash-alt btn align-middle"));

            li_row.append(li_comment);
            li_row.append(li_removes);

            item.append(li_row);
            $list.append(item);
        });

    });

    $(document).on('click', '.btn_comment', function (event) {
        var $btn = $(this);

        API.saveComment({ comment: $btn.parent().parent().find("#message-text").val() }, $btn.attr("data-id")).then(function (data) {
            $btn.parent().parent().find("#message-text").val("");
            $(document).find(".modal ").modal('toggle');
        });
    })
/////////////////////////////////////////////////////////////////////////////////////////////////
    $(document).on('click', '.fa-trash-alt', function (event) {
        var $btn = $(this);
        var id = $(this).attr("data_id");

        API.deleteComments(id).then(function () {
            $btn.parent().parent().remove();
        });
    })
});

var API = {
    newArticles: function () {
        return $.ajax({
            headers: {
                "Content-Type": "application/json"
            },
            type: "POST",
            url: "api/scrape"
        });
    },
    saveArticle: function (article) {
        return $.ajax({
            url: "/api/addArticle",
            method: "POST",
            data: article,
            dataType: "json"
        });
    },
    saveComment: function (comment, _id) {
        return $.ajax({
            url: "/api/addComment/" + _id,
            method: "POST",
            data: comment,
            dataType: "json"
        });
    },
    deleteArticle: function (id) {
        return $.ajax({
            url: "/api/deleteArticle",
            method: "POST",
            data: { id: id }
        });
    },
    getComments: function (id) {
        return $.ajax({
            url: "/api/getComments",
            method: "POST",
            data: { id: id },
            dataType: "json"
        });
    },
    deleteComments: function (id) {
        return $.ajax({
            url: "/api/deleteComments",
            method: "POST",
            data: { id: id },
            dataType: "json"
        });
    }
};

var handleNewArticles = function () {
    API.newArticles().then(function (data) {
        showNewArticles(data);
    });
};

function showNewArticles(articles) {
    $("#saved_articles-list").empty();

    articles.forEach(element => {
        var $li = $('<li class="list-group-item">');
        var $lvl_1 = $('<div class="row mb-2">');
        var $lvl_2 = $('<div class="col-md-12">');
        var $lvl_3 = $('<div class="card flex-md-row mb-4 box-shadow h-md-250">');

        var $body = $('<div class="card-body d-flex flex-column align-items-start">');

        var $headline = $('<h3 class="mb-0">');

        var $ref = $(`<a class="text-dark card-headline" href=${element.url} target="blank">`)
            .text(element.headline);
        $headline.append($ref);

        var $date = $('<div class="mb-1 text-muted card-date">')
            .text(element.date);

        var $summary = $('<p class="card-text mb-auto">')
            .text(element.summary);

        $btns = $('<div class="d-flex justify-content-between align-items-center">');
        $sub = $('<div class="btn-group pt-3">');
        $btn = ('<button type="button" class="btn btn-sm btn-outline-secondary btn_save">Save</button>');
        $btn_link = $(`<a class="btn btn-sm btn-outline-secondary btn_read" href=${element.url} target="blank">Read</a>`);
        $sub.append($btn);
        $sub.append($btn_link);
        $btns.append($sub);

        var picture = element.photo.split("&q=")[0] + "&q=90&w=250&h=250&zc=1";
        var $pic = $(`<img class="card-img-right flex-auto d-none d-md-block" src=${picture} alt="Card image"></img>`);

        $body.append($headline);
        $body.append($date);
        $body.append($summary);
        $body.append($btns);

        $lvl_3.append($body);
        $lvl_3.append($pic);
        $lvl_2.append($lvl_3);
        $lvl_1.append($lvl_2);
        $li.append($lvl_1);

        //Append to the list
        $('#saved_articles-list').append($li);
    });
}

function handleClrArticles() {
    $("#saved_articles-list").empty();
}

// Add event listeners to the submit and delete buttons
$newArticles.on("click", handleNewArticles);
$clearArticles.on("click", handleClrArticles);

//-----------------------------------------------------------------------------------------------------------