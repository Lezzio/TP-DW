<?xml version="1.0"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:param name="countryCode"/>

    <xsl:template match="/">
        <html>
            <body>
                <div id="button3-render">
                    <p>
                        Country's official name :
                        <xsl:value-of select="//country[country_codes/cca2 = $countryCode]/country_name/official_name"/>
                    </p>
                    <p>
                        Capital :
                        <xsl:value-of select="//country[country_codes/cca2 = $countryCode]/capital"/>
                    </p>
                </div>
            </body>
        </html>
    </xsl:template>

</xsl:stylesheet>