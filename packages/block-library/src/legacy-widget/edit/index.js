/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	BlockControls,
	InspectorControls,
	BlockIcon,
} from '@wordpress/block-editor';
import {
	ToolbarGroup,
	ToolbarButton,
	Spinner,
	Placeholder,
} from '@wordpress/components';
import { brush as brushIcon, update as updateIcon } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { useState, useCallback } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import WidgetTypeSelector from './widget-type-selector';
import InspectorCard from './inspector-card';
import FormWrapper from './form-wrapper';
import Form from './form';
import PreviewIframe from './preview-iframe';

export default function Edit( props ) {
	const { id, idBase } = props.attributes;
	return (
		<div { ...useBlockProps() }>
			{ JSON.stringify( props.attributes ) }
			{ ! id && ! idBase ? (
				<Empty { ...props } />
			) : (
				<NotEmpty { ...props } />
			) }
		</div>
	);
}

function Empty( { attributes: { id, idBase }, setAttributes } ) {
	return (
		<Placeholder
			icon={ <BlockIcon icon={ brushIcon } /> }
			label={ __( 'Legacy Widget' ) }
		>
			<WidgetTypeSelector
				selectedId={ id ?? idBase }
				onSelect={ ( { selectedId, isMulti } ) => {
					if ( ! selectedId ) {
						setAttributes( {
							id: null,
							idBase: null,
							instance: null,
						} );
					} else if ( isMulti ) {
						setAttributes( {
							id: null,
							idBase: selectedId,
							instance: {},
						} );
					} else {
						setAttributes( {
							id: selectedId,
							idBase: null,
							instance: null,
						} );
					}
				} }
			/>
		</Placeholder>
	);
}

function NotEmpty( { attributes: { id, idBase, instance }, setAttributes } ) {
	const { widgetType, hasResolved } = useSelect( ( select ) => ( {
		widgetType: select( coreStore ).getWidgetType( id ?? idBase ),
		hasResolved: select( coreStore ).hasFinishedResolution(
			'getWidgetType',
			[ id ?? idBase ]
		),
	} ) );

	const [ tab, setTab ] = useState( 'edit' );

	const setInstance = useCallback(
		( newInstance ) => setAttributes( { instance: newInstance } ),
		[ setAttributes ]
	);

	if ( ! widgetType && ! hasResolved ) {
		return <Spinner />;
	}

	if ( ! widgetType && hasResolved ) {
		return <Placeholder>{ __( 'Widget is missing.' ) }</Placeholder>;
	}

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					{ /* TODO: Hide this if widget is hidden. */ }
					<ToolbarButton
						label={ __( 'Change widget' ) }
						icon={ updateIcon }
						onClick={ () =>
							setAttributes( {
								id: null,
								idBase: null,
								instance: null,
							} )
						}
					/>
					{ idBase && (
						<>
							<ToolbarButton
								className="components-tab-button"
								isPressed={ tab === 'edit' }
								onClick={ () => setTab( 'edit' ) }
							>
								<span>{ __( 'Edit' ) }</span>
							</ToolbarButton>
							<ToolbarButton
								className="components-tab-button"
								isPressed={ tab === 'preview' }
								onClick={ () => setTab( 'preview' ) }
							>
								<span>{ __( 'Preview' ) }</span>
							</ToolbarButton>
						</>
					) }
				</ToolbarGroup>
			</BlockControls>

			<InspectorControls>
				<InspectorCard
					name={ widgetType.name }
					description={ widgetType.description }
				/>
			</InspectorControls>

			<FormWrapper title={ widgetType.name } isVisible={ tab === 'edit' }>
				<Form
					id={ id }
					idBase={ idBase }
					instance={ instance }
					setInstance={ setInstance }
				/>
			</FormWrapper>

			{ idBase && (
				<PreviewIframe
					idBase={ idBase }
					instance={ instance }
					isVisible={ tab === 'preview' }
				/>
			) }
		</>
	);
}
