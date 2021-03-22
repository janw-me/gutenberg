/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';

const DEFAULT_HIDDEN_WIDGET_TYPES = [
	'pages',
	'calendar',
	'archives',
	'media_audio',
	'media_image',
	'media_gallery',
	'media_video',
	'meta',
	'search',
	'text',
	'categories',
	'recent-posts',
	'recent-comments',
	'rss',
	'tag_cloud',
	'nav_menu',
	'custom_html',
	'block',
];

export default function isWidgetTypeHidden( id ) {
	return applyFilters(
		'legacyWidget.isWidgetTypeHidden',
		DEFAULT_HIDDEN_WIDGET_TYPES.includes( id ),
		id
	);
}
