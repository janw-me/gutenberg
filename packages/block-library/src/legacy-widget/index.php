<?php

function render_block_core_legacy_widget( $attributes ) {
	if ( isset( $attributes['id'] ) ) {
		$sidebar_id = gutenberg_find_sidebar_id( $attributes['id'] );
		return gutenberg_render_widget( $attributes['id'], $sidebar_id );
	}

	if ( ! isset( $attributes['idBase'] ) ) {
		return '';
	}

	$widget_object = gutenberg_get_widget_object( $attributes['idBase'] );

	if ( ! $widget_object ) {
		return '';
	}

	if ( isset( $attributes['instance']['encoded'], $attributes['instance']['hash'] ) ) {
		$serialized_instance = base64_decode( $attributes['instance']['encoded'] );
		if ( wp_hash( $serialized_instance ) !== $attributes['instance']['hash'] ) {
			return '';
		}
		$instance = unserialize( $serialized_instance );
	} else {
		$instance = array();
	}

	ob_start();
	the_widget( get_class( $widget_object ), $instance );
	return ob_get_clean();

	// TODO: Output widget with sidebar stuff when in Widgets screen.
}

function register_block_core_legacy_widget() {
	register_block_type_from_metadata(
		__DIR__ . '/legacy-widget',
		array(
			'render_callback' => 'render_block_core_legacy_widget',
		)
	);
}

add_action( 'init', 'register_block_core_legacy_widget' );
