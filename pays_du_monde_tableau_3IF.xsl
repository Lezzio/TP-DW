<?xml version="1.0" encoding="UTF-8"?>

<!-- New document created with EditiX at Wed Mar 03 16:09:04 CET 2021 -->

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:output method="html"/>
	
	<xsl:template match="/">
		<html>
			<head> 
				<title> 
					Pays du monde 
				</title> 
			</head> 

			<body style="background-color:white;">  
				<h1>Les pays du monde</h1> 
				Mise en forme par : Allan Guigal et Aurélien Tournade (B3409)
			</body> 
			<br/>

			<xsl:apply-templates select = "//metadonnees"/>

			<hr/>
			<xsl:call-template name = "countriesWithNNeighbours">
				<xsl:with-param name = "nbNeighbours" select = "6"/>
			</xsl:call-template>
			<br/><br/>

			<xsl:call-template name = "mostNeighbours"/>
			
			<hr/>

			<xsl:variable name = "listContinents" select = "//country/infosContinent/continent[not(. = ../../preceding-sibling::*/infosContinent/continent)]"/>
			
			<xsl:apply-templates select = "$listContinents"/>			

		</html>
	</xsl:template>

	<xsl:template name = "countriesWithNNeighbours">
		<xsl:param name = "nbNeighbours"/>
		Pays avec <xsl:value-of select = "$nbNeighbours"/> voisins : <xsl:text> </xsl:text>
			<xsl:for-each select = "//country[count(borders/neighbour) = $nbNeighbours]/country_name/common_name">
				<xsl:value-of select = "."/>
				<xsl:if test = "not(position() = last())">
					<xsl:text>, </xsl:text>
				</xsl:if>
			</xsl:for-each>	
		
	</xsl:template>

	<xsl:template name = "mostNeighbours">
		<xsl:variable name = "max_neighbours">
			<xsl:for-each select = "//country">
				<xsl:sort select = "count(./borders/neighbour)" data-type = "number" order = "descending"/>
				<xsl:if test = "position() = 1"><xsl:value-of select = "./country_name/common_name"/></xsl:if>
			</xsl:for-each>
		</xsl:variable>
		Le pays avec le plus de voisins : <xsl:value-of select = "$max_neighbours"/> (<xsl:value-of select = "count(//country[country_name/common_name = $max_neighbours]/borders/neighbour)"/>) 
	</xsl:template>

	<xsl:template match = "//country/infosContinent/continent">
		<br/>
		<xsl:variable name = "Continent" select = "."/>
		<xsl:if test = "$Continent != ''">

			<h3>
				Continent : <xsl:value-of select = "$Continent"/> par sous-regions
			</h3>
			<xsl:variable name = "listSubregions" select = "//country/infosContinent/subregion[../continent = $Continent and not(. = ../../preceding-sibling::*/infosContinent/subregion)]"/>

			<xsl:apply-templates select = "$listSubregions"/>
		</xsl:if>

		<xsl:if test = "$Continent = ''">
			<xsl:call-template name = "withoutContinent"/>
		</xsl:if>
	</xsl:template>

	<xsl:template name = "withoutContinent">

		<xsl:variable name = "listCountries" select = "//country[infosContinent/continent = '']"/>
		<h3>
			Sans continent : <text> </text> (<xsl:value-of select = "count($listCountries)"/> pays)
		</h3>
		<xsl:call-template name = "constructTableWithCountries">
			<xsl:with-param name = "listCountries" select = "$listCountries"/>
		</xsl:call-template>

	</xsl:template>

	<xsl:template name = "constructTableWithCountries">
		<xsl:param name = "listCountries"/>
		<table border="3" width="100%" align="center">
			<tr>
				<th style = "test-align:center">N°</th>
				<th style = "test-align:center">Nom</th>
				<th style = "test-align:center">Capitale</th>
				<th style = "test-align:center">Voisins</th>
				<th style = "test-align:center">Coordonnées</th>
				<th style = "test-align:center">Drapeau</th>
			</tr>
			<xsl:apply-templates select = "$listCountries"/>
		</table>
	</xsl:template>


	<xsl:template match = "//country/infosContinent/subregion">
		<xsl:variable name = "Subregion" select = "."/>
		<xsl:variable name = "listCountries" select = "//country[infosContinent/subregion = $Subregion]"/>
		<h4>
			Subregion : <xsl:value-of select = "."/><xsl:text> </xsl:text>(<xsl:value-of select = "count($listCountries)"/> pays)
		</h4>
		<xsl:call-template name = "constructTableWithCountries">
			<xsl:with-param name = "listCountries" select = "$listCountries"/>
		</xsl:call-template>
	</xsl:template>

	<xsl:template match="metadonnees">
		<p style="text-align:center; color:blue;">
			Objectif : <xsl:value-of select="objectif"/>
		</p><hr/>
	</xsl:template>

	<xsl:template match="//country">
		<xsl:variable name = "Country" select = "."/>
		<xsl:variable name = "number">
			<xsl:if test = "$Country/infosContinent/subregion">
				<xsl:value-of select = "count(preceding-sibling::*[./infosContinent/subregion = $Country/infosContinent/subregion]) + 1"/>
			</xsl:if>
			<xsl:if test = "not($Country/infosContinent/subregion)">
				<xsl:value-of select = "count(preceding-sibling::*[not(./infosContinent/subregion)])"/>
			</xsl:if>
		</xsl:variable>

		<tr>
			<td>
				<xsl:value-of select = "$number"/>
			</td>
			<td>
				<span style='color:green' >
					<xsl:value-of select="country_name/common_name"/>
				</span>
				<span>
					(<xsl:value-of select="country_name/official_name"/>)
				</span>
				<br/>
				<xsl:if test = "country_name/native_name">
					Noms natifs:
					<ul>
						<xsl:apply-templates select = "country_name/native_name"/>
					</ul>
				</xsl:if>

			</td>
			<td>
				<xsl:apply-templates select = "capital"/>
			</td>

			<td>
				<xsl:if test = "count(borders/neighbour) = 0 and landlocked = 'false'">Ile</xsl:if>
				<xsl:apply-templates select = "borders/neighbour"/>
			</td>

			<td>
				<xsl:apply-templates select = "coordinates"/>
			</td>

			<td>
				<xsl:apply-templates select = "country_codes/cca2"/>
			</td>
		</tr>



	</xsl:template>

	<xsl:template match="native_name">
		<li>
			<xsl:value-of select="."/>(<xsl:value-of select = "./@lang"/>)
		</li>
	</xsl:template>

	<xsl:template match="capital">
		<xsl:value-of select="."/>
	</xsl:template>

	<xsl:template match = "neighbour">

		<xsl:variable
			name="cca3"
			select=".">

		</xsl:variable> 

		<xsl:variable
			name = "following"
			select = "count(following-sibling::*)">
		</xsl:variable>

		<xsl:for-each select = "//country">
			<xsl:if test = "country_codes/cca3 = $cca3">
				<xsl:value-of select = "country_name/common_name"/>
				<xsl:if test = "$following > 0">, </xsl:if>
			</xsl:if>
		</xsl:for-each>
	</xsl:template>

	<xsl:template match = "coordinates">

		Latitude : <xsl:value-of select = "@lat"/>
		<br/>
		Longitude : <xsl:value-of select = "@long"/>
	</xsl:template>

	<xsl:template match = "cca2">
		<xsl:variable name="lowercase" select="'abcdefghijklmnopqrstuvwxyz'" />
		<xsl:variable name="uppercase" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'" />
		<xsl:variable
			name = "cca2Upper"
			select = ".">
		</xsl:variable>
		<xsl:variable
			name = "cca2Lower"
			select = "translate($cca2Upper, $uppercase, $lowercase)">
		</xsl:variable>

		<img alt="" height="40" width="60">
			<xsl:attribute name = "src">
				<xsl:value-of select = "concat('http://www.geonames.org/flags/x/', $cca2Lower, '.gif')" />
			</xsl:attribute>

		</img> 

	</xsl:template>

	


</xsl:stylesheet>


