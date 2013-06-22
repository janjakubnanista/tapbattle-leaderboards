$(function() {
    'use strict';

    var loadMoreButton = function() {
        return $('.more');
    };

    var hasMore = function() {
        return $('.more').is(':visible');
    };

    var moreLink = function() {
        return $('.more').attr('href') || null;
    };

    var loadMore = function(event) {
        event.preventDefault();

        loadMoreButton().off('click', loadMore).addClass('disabled');

        $.ajax(moreLink(), { dataType: 'html' }).then(function(html) {
            var $doc = $(html),
                $scores = $doc.find('.score', '.main'),
                $pagination = $doc.find('.pagination');

            $('.pagination').replaceWith($pagination);
            $('.main .scores').append($scores);

            loadMoreButton().on('click', loadMore).toggle(hasMore()).removeClass('disabled');
        });
    };

    loadMoreButton().on('click', loadMore).toggle(hasMore());
});
