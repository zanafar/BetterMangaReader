'use strict';

function initParser() {
	/**
	 * Returns the chapter's number via it's url.
	 * Helper function for this Manga Here parser.
	 * @param  {String} url Url for a chapter
	 * @return {Number}     Chapter Number
	 */
	function getChapterNumberFromChapterUrl( url ) {
		return parseFloat( url.split( '/' ).slice( -2, -1 )[ 0 ].substr( 1 ) );
	}


	const parser = {

		name: 'Manga Here',
		normalizedName: 'mangahere', // should be the main part of the/a url. No prefix or suffixs.
		urls: [ 'mangahere.co' ],


		/**
		 * Gets the chapter list from inside a manga
		 * @param  {HTML} HTML HTML of the page
		 * @return {Array}      Array of Chapters found on the page
		 */
		getChaptersListFromChapter: ( HTML ) => {
			const chapters = [];

			$( '#bottom_chapter_list option', HTML ).each( ( index, element ) => {
				const option = $( element );

				const title = option.text().trim();
				const url = option.val();
				const number = getChapterNumberFromChapterUrl( url );

				chapters.push( { number, title, url } );
			} );

			return chapters;
		},


		/**
		 * Get all the chapters of a manga from their profile page on a given site
		 * @param  {HTML} HTML HTML of the manga's profile page
		 * @return {Promise}       Resolves to an array of Chapters
		 */
		getChaptersListFromProfile: ( HTML ) => {
			const chapters = [];

			$( '.detail_list ul li span.left a', HTML ).each( ( index, element ) => {
				const option = $( element );

				const title = option.text().trim();
				const url = option.attr( 'href' );
				const number = getChapterNumberFromChapterUrl( url );

				chapters.push( { number, title, url } );
			} );

			return chapters;
		},


		/**
		 * Retrieve information about the current Manga via a chapter page
		 * @param  {HTML} page context for jQuery to search in
		 * @return {Object}      Info object
		 */
		getChapterInfo: ( HTML ) => {
			const search = $( '.readpage_top .title a', HTML );
			const chapter = $( search[ 0 ] );
			const manga = $( search[ 1 ] );

			let name = manga.text().trim();

			if ( name.substr( -5 ) === 'Manga' ) {
				name = name.substr( 0, name.length - 5 ).trim();
			}

			const chapterUrl = chapter.attr( 'href' );
			const mangaUrl = manga.attr( 'href' );
			const number = getChapterNumberFromChapterUrl( chapterUrl );

			return {
				chapterUrl,
				mangaUrl,
				name,
				number,
			};
		},


		/**
		 * Get the Urls of the pages for a chapter
		 * @param  {HTML} HTML HTML of the page
		 * @return {Array}      The list of the pages in this chapter to be used later when making the image urls.
		 */
		getPages: ( HTML ) => {
			const pages = [];

			$( '.readpage_top .go_page .right select option', HTML ).each( ( index, element ) => {
				pages.push( $( element ).val() );
			} );

			return pages;
		},


		/**
		 * This method returns the place to write the full chapter in the document
		 * The returned element will be totally emptied.
		 * @return {Selector}      CSS Element Selector
		 */
		scanContainer: () => '#viewer',


		/**
		 * Is the current page being viewed a chapter in a manga?
		 * @param  {HTML}  HTML HTML of the page
		 * @return {Boolean}      Whether or not it is a page in a chapter
		 */
		isChapterPage: ( HTML ) => $( '#image', HTML ).length > 0,


		/**
		 * Is the current page being viewed a profile page for a manga?
		 * @param  {HTML}  HTML HTML of the page
		 * @return {Boolean}      Whether or not it is a profile page for a manga
		 */
		isProfilePage: ( HTML ) => $( '.detail_list', HTML ).length > 0,


		/**
		 * Get the image Urls from all the chapter pages
		 * @param  {HTML} HTML HTML of a chapter page
		 * @return {Promise}     Resolves to the Url of the desired Image
		 */
		getImageFromPage: ( HTML ) => $( '#image', HTML ).attr( 'src' ),

	};


	/**
	 * Register the Parser so it can be accessed
	 */
	window.parsers.register( parser );
}

initParser();
