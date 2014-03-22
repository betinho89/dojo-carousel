dojo-carousel
=============

Plugin para generar un carrusel utilizando el framework de dojo.

Opciones del plugin.
=============
<table>
	<caption>Parámetros</caption>
	<thead>
		<tr>
			<th>Tipo</th>
			<th>Nombre</th>
			<th>Descripción</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>string</td>
			<td><b>sSource</b></td>
			<td><i>Origen de las imágenes del carousel.</i></td>
		</tr>
		<tr>
			<td>string</td>
			<td><b>sTarget</b></td>
			<td><i>Destino de las imágenes al hacer clic sobre el carousel.</i></td>
		</tr>
		<tr>
			<td>string</td>
			<td><b>sPosition</b></td>
			<td><i>Posición del carousel 'horizontal' o 'vertical'.</i></td>
		</tr>
		<tr>
			<td>boolean</td>
			<td><b>bSameWidth</b></td>
			<td><i>Si es verdadero y la posición es 'vertical' toma el mismo alto que el ancho del contenedor.</i></td>
		</tr>
		<tr>
			<td>boolean</td>
			<td><b>bShowInfo</b></td>
			<td><i>Si es verdadero lee las propiedades de data-title y data-description del elemento, para mostrarlo.</i></td>
		</tr>
		<tr>
			<td>int</td>
			<td><b>iMaxHeight</b></td>
			<td><i>Si el bSameWidth es falso, toma este valor como el alto del carousel (pixeles), solo si la posición es vertical.</i></td>
		</tr>
		<tr>
			<td>int</td>
			<td><b>iDuration</b></td>
			<td><i>Duracción en segundos, que tarda para cambiar entre secciones de imágenes dentro del carousel.</i></td>
		</tr>
		<tr>
			<td>int</td>
			<td><b>iNumberImages</b></td>
			<td><i>Número de imágenes a mostrar por sección en el carousel.</i></td>
		</tr>
	</tbody>
</table>
<p><b>NOTA:</b> sTarget y sSource son obligatorios.</p>
<p>Opciones por defecto.</p>
<pre>
	sPosition: "horizontal",
	bSameWidth: false,
	iMaxHeight: 500,
	iDuration: 5,
	iNumberImages: 3,
	bContinue: false,
	bShowInfo: false,
</pre>

Metadatos y clases para el código HTML
=============
<p><b>Metadatos configurables.</b></p>
<ul>
	<li><b>data-title:</b> Titulo del elemento del carousel.</li>
	<li><b>data-description:</b> Descripción del elemento del carousel.</li>
</ul>
<p><b>Clases</b></p>
<ul>
	<li><b>carousel-target:</b> Para la etiqueta html que sera el target del carousel, donde se mostraran las imágenes al dar clic.</li>
	<li><b>carousel-source:</b> Para la etiqueta html que sera la fuente del carousel, en donde estarán los elementos del carousel.</li>
	<li><b>carousel-element:</b> Para todos los elementos que estarán dentro de la etiqueta fuente del carousel.</li>
	<li><b>video-element:</b> Para los elementos que son vídeos y que se encuentran dentro de la etiqueta fuente del carousel.</li>
</ul>

Como usar
=============
<p>Código Javascript.</p>
<pre>
	// Configuración
	var settings = {
		sSource: "carousel-source",
		sTarget: "carousel-target",
		sPosition: "vertical",
		iNumberImages: 2,
		bShowInfo: true
	};

	// Se crea una nueva instancia del carousel.
	var oCustomCarousel = new Carousel();

	// Se establecen la configuración del usuario.
	oCustomCarousel.setSettings(settings);

	// Se inicia el carousel
	oCustomCarousel.initCarousel();
</pre>
<p>Código html.</p>
<pre>
	&lt;div id="content">
		&lt;div id="carousel-target" class="carousel-target">&lt;/div>
		&lt;div id="carousel-source" class="carousel-source">
			&lt;img src="img/chris1_lg.jpg" class="carousel-element" data-title="Titulo 1" data-description="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." alt="">
			&lt;div class="carousel-element video-element" data-title="Titulo 4" data-description="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.">
				&lt;iframe src="//www.youtube.com/embed/S7b1aLY3tyI" frameborder="0" allowfullscreen>&lt;/iframe>
			&lt;/div>
			&lt;img src="img/chris3_lg.jpg" class="carousel-element" data-title="Titulo 5" data-description="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." alt="">
		&lt;/div>
	&lt;/div>
</pre>
<p>Para ver ejemplo da clic <a href="http://www.betinho89.com/examples/carousel-with-dojo/" title="">aquí.</a></p>
