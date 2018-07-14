/* globals articles */
'use strict';

let articleView = {};

articleView.populateFilters = () => {
  // REVIEW: Add .not('.template') instead of if(!$(this).hasClass('template'))
  $('article').not('.template').each(function() {
    let val = $(this).find('address a').text();
    let optionTag = `<option value="${val}">${val}</option>`;

    if ($(`#author-filter option[value="${val}"]`).length === 0) {
      $('#author-filter').append(optionTag);
    }

    val = $(this).attr('data-category');
    optionTag = `<option value="${val}">${val}</option>`;
    if ($(`#category-filter option[value="${val}"]`).length === 0) {
      $('#category-filter').append(optionTag);
    }
  });
};

articleView.handleAuthorFilter = () => {
  $('#author-filter').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $(`article[data-author="${$(this).val()}"]`).fadeIn();
    } else {
      // REVIEW: Instead of .not('.template'), you can also use :not(.template) in the selector
      $('article:not(.template)').fadeIn();
    }
    $('#category-filter').val('');
  });
};

articleView.handleCategoryFilter = () => {
  $('#category-filter').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $(`article[data-category="${$(this).val()}"]`).fadeIn();
    } else {
      $('article:not(.template)').fadeIn();
    }
    $('#author-filter').val('');
  });
};

articleView.handleMainNav = () => {
  $('nav').on('click', '.tab', function(e) {
    e.preventDefault();
    $('.tab-content').hide();
    $(`#${$(this).data('content')}`).fadeIn();
  });

  $('nav .tab:first').click();
};

articleView.setTeasers = () => {
  $('.article-body *:nth-of-type(n+2)').hide();
  $('article').on('click', 'a.read-on', function(e) {
    e.preventDefault();
    if ($(this).text() === 'Read on →') {
      $(this).parent().find('*').fadeIn();
      $(this).html('Show Less &larr;');
    } else {
      $('body').animate({
        scrollTop: ($(this).parent().offset().top)
      },200);
      $(this).html('Read on &rarr;');
      $(this).parent().find('.article-body *:nth-of-type(n+2)').hide();
    }
  });
};

// COMMENT: Where is this function called? Why?
// Its called on new.html to connect this js to it and not with our regular
articleView.initNewArticlePage = () => {
  // TO/DO: Ensure the main .tab-content area is revealed. We might add more tabs later or otherwise edit the tab navigation.
  $('nav .tab[data-content="write"]').click();

  // TO/DO: The new articles we create will be copy/pasted into our source data file.
  // Set up this "export" functionality. We can hide it for now, and show it once we have data to export.
  $('#article-export').hide();
  $('#article-json').on('focus', function(){
    this.select();
  });

  // TO/DO: Add an event handler to update the preview and the export field if any inputs change.
  $('#new-form').on('change',articleView.create)
};

articleView.create = () => {
  // TO/DO: Set up a variable to hold the new article we are creating.
  // Clear out the #articles element, so we can put in the updated preview
  let articleDataObj = {};

  articleDataObj.title = $('#article-title').val();
  articleDataObj.body = $('#article-body').val();
  articleDataObj.author = $('#article-author').val();
  articleDataObj.authorUrl = $('#article-author-url').val();
  articleDataObj.category = $('#article-category').val();

  var today = new Date();

  var dateString = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
  articleDataObj.publishedOn = $('#article-published').is(':checked') ? dateString : null;

  // TO/DO: Instantiate an article based on what's in the form fields:
  let article = new Article(articleDataObj);

  // TO/DO: Use our interface to the Handblebars template to put this new article into the DOM:
  $('#articles').empty().append(article.toHtml());

  // TO/DO: Activate the highlighting of any code blocks; look at the documentation for hljs to see how to do this by placing a callback function in the .each():
  $('pre code').each();

  // TO/DO: Show our export field, and export the new article as JSON, so it's ready to copy/paste into blogArticles.js:
  $('#article-export').show();
  $('#article-json').val(JSON.stringify(articleDataObj) + ',');
};

// COMMENT: Where is this function called? Why?
// This is on the index.html, it does the same functionallity of the .ready() but only on the right page.
articleView.initIndexPage = () => {
  articles.forEach(article => $('#articles').append(article.toHtml()));
  articleView.populateFilters();
  articleView.handleCategoryFilter();
  articleView.handleAuthorFilter();
  articleView.handleMainNav();
  articleView.setTeasers();
};
